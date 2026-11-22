# PowerShell Script to Test Personal Diary API
# Run this after starting the server with: npm start

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Personal Diary API - Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$port = 3000
if (Test-Path ".env") {
    $portLine = Get-Content ".env" | Where-Object { $_ -match "^PORT\s*=\s*(\d+)" }
    if ($portLine -match "^PORT\s*=\s*(\d+)") { $port = $matches[1] }
}
$baseUrl = "http://localhost:$port/api"
$testEmail = "test_user_$(Get-Random)@example.com"
$testPassword = "password123"

# Test 1: Register User
Write-Host "Test 1: Registering new user ($testEmail)..." -ForegroundColor Yellow
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json)
    Write-Host "[OK] Registration successful!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login User
Write-Host "Test 2: Logging in..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json)
    $token = $loginResponse.token
    Write-Host "[OK] Login successful!" -ForegroundColor Green
    Write-Host "  Token received: $($token.Substring(0, [Math]::Min(25, $token.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Create Entry
Write-Host "Test 3: Creating encrypted diary entry..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/entries" -Method POST -Headers $headers -Body (@{
        title = "Test Entry $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        tags = @("test", "automated")
        category = "personal"
        mood = "happy"
        color = "#667eea"
        favorite = $true
        text = "This is an automated test entry created at $(Get-Date). The content is encrypted with AES-256-GCM!"
    } | ConvertTo-Json)
    $entryId = if ($createResponse.id) { $createResponse.id } else { $createResponse._id }
    Write-Host "[OK] Entry created successfully!" -ForegroundColor Green
    Write-Host "  Entry ID: $entryId" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Entry creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: List Entries
Write-Host "Test 4: Fetching all entries..." -ForegroundColor Yellow
try {
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/entries" -Method GET -Headers $headers
    Write-Host "[OK] Entries fetched successfully!" -ForegroundColor Green
    Write-Host "  Total entries: $($listResponse.Count)" -ForegroundColor Gray
    foreach ($entry in $listResponse | Select-Object -First 3) {
        Write-Host "  - $($entry.title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[FAIL] Fetching entries failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Get Single Entry (Decrypted)
Write-Host "Test 5: Fetching single entry (decrypted)..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/entries/$entryId" -Method GET -Headers $headers
    Write-Host "[OK] Entry fetched and decrypted successfully!" -ForegroundColor Green
    Write-Host "  Title: $($getResponse.title)" -ForegroundColor Gray
    Write-Host "  Text: $($getResponse.text.Substring(0, [Math]::Min(50, $getResponse.text.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Fetching entry failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 6: Update Entry
Write-Host "Test 6: Updating entry..." -ForegroundColor Yellow
try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/entries/$entryId" -Method PUT -Headers $headers -Body (@{
        title = "Updated Test Entry"
        tags = @("test", "updated")
        category = "goals"
        mood = "excited"
        color = "#10b981"
        favorite = $true
        text = "This entry has been updated and re-encrypted at $(Get-Date)"
    } | ConvertTo-Json)
    Write-Host "[OK] Entry updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Updating entry failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 7: Search by Tag
Write-Host "Test 7: Searching entries by tag..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/entries?tag=test" -Method GET -Headers $headers
    Write-Host "[OK] Search successful!" -ForegroundColor Green
    Write-Host "  Entries with 'test' tag: $($searchResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Search failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 8: Delete Entry
Write-Host "Test 8: Deleting entry..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/entries/$entryId" -Method DELETE -Headers $headers
    Write-Host "[OK] Entry deleted successfully!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Deleting entry failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ALL TESTS PASSED! [OK]" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your Personal Diary API is working perfectly!" -ForegroundColor Green
Write-Host "Open http://localhost:$port/diary in your browser to use the app." -ForegroundColor Cyan
