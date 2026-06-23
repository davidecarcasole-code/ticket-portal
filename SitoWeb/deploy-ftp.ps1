param(
    [string]$FtpHost,
    [string]$FtpUser,
    [string]$FtpPassword,
    [string]$LocalPath = "$PSScriptRoot\wp-content\themes\studio-legale-mandroneniglio",
    [string]$RemotePath = "/www/studiolegalemandroneniglio.it/htdocs/wp-content/themes/studio-legale-mandroneniglio"
)

if (-not $FtpHost) { $FtpHost = Read-Host "Host FTP (es. ftp.studiolegalemandroneniglio.it)" }
if (-not $FtpUser) { $FtpUser = Read-Host "Utente FTP" }
if (-not $FtpPassword) { $SecurePass = Read-Host "Password FTP" -AsSecureString; $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass); $FtpPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR); [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) }

$FtpRoot = "ftp://$FtpHost"

Write-Host "`n=== Deploy tema Studio Legale Mandroneniglio via FTP ===" -ForegroundColor Cyan
Write-Host "Locale:  $LocalPath" -ForegroundColor Gray
Write-Host "Remoto:  $RemotePath" -ForegroundColor Gray
Write-Host "Host:    $FtpHost" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $LocalPath)) {
    Write-Host "ERRORE: cartella locale non trovata: $LocalPath" -ForegroundColor Red
    exit 1
}

$AllFiles = Get-ChildItem $LocalPath -Recurse -File
$Total = $AllFiles.Count
$Current = 0
$Errors = 0

function Create-FtpDir($dir) {
    $uri = New-Object System.Uri("$FtpRoot/$dir")
    try {
        $req = [System.Net.FtpWebRequest]::Create($uri)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPassword)
        $req.UsePassive = $true
        $req.UseBinary = $true
        $req.KeepAlive = $false
        $resp = $req.GetResponse()
        $resp.Close()
        return $true
    } catch {
        # directory already exists — fine
        return $false
    }
}

function Upload-File($localFile, $remoteRelPath) {
    $remoteFull = "$RemotePath/$remoteRelPath".Replace('\', '/')
    $uri = New-Object System.Uri("$FtpRoot/$remoteFull")
    try {
        $req = [System.Net.FtpWebRequest]::Create($uri)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPassword)
        $req.UsePassive = $true
        $req.UseBinary = $true
        $req.KeepAlive = $false
        $fileBytes = [System.IO.File]::ReadAllBytes($localFile)
        $req.ContentLength = $fileBytes.Length
        $stream = $req.GetRequestStream()
        $stream.Write($fileBytes, 0, $fileBytes.Length)
        $stream.Close()
        $resp = $req.GetResponse()
        $resp.Close()
        return $true
    } catch {
        Write-Host "    ERRORE: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "Creazione struttura directory remote..." -ForegroundColor Yellow
# Collect unique remote directories
$Dirs = New-Object System.Collections.Generic.HashSet[string]
$AllFiles | ForEach-Object {
    $rel = $_.FullName.Substring($LocalPath.Length + 1)
    $dir = Split-Path $rel -Parent
    if ($dir -and $dir -ne '') {
        $null = $Dirs.Add($dir.Replace('\', '/'))
    }
}
foreach ($d in $Dirs) {
    $parts = $d -split '/'
    $acc = $RemotePath
    foreach ($p in $parts) {
        $acc = "$acc/$p"
        Create-FtpDir $acc | Out-Null
    }
}
# Ensure root remote dir exists
Create-FtpDir $RemotePath | Out-Null

Write-Host "`nCaricamento file ($Total totali)..." -ForegroundColor Yellow
foreach ($f in $AllFiles) {
    $Current++
    $rel = $f.FullName.Substring($LocalPath.Length + 1)
    Write-Host "[$Current/$Total] $rel" -ForegroundColor Gray
    if (-not (Upload-File $f.FullName $rel)) {
        $Errors++
    }
}

Write-Host "`n=== Deploy completato ===" -ForegroundColor Green
if ($Errors -gt 0) {
    Write-Host "$Errors errori riscontrati." -ForegroundColor Red
} else {
    Write-Host "Tutti i $Total file caricati con successo." -ForegroundColor Green
}

Write-Host "`nProssimi passi:" -ForegroundColor Cyan
Write-Host "1. Attiva il tema da WordPress > Aspetto > Temi" -ForegroundColor White
Write-Host "2. Crea le pagine: Forum (template 'Forum'), Profilo (template 'Profilo Utente'), Contatti (template 'Contatti')" -ForegroundColor White
Write-Host "3. Vai su Impostazioni > Permalink e scegli 'Nome articolo'" -ForegroundColor White
Write-Host "4. Crea il menu da Aspetto > Menu (Home, Forum, Profilo, Contatti)" -ForegroundColor White
Write-Host "5. Installa plugin consigliati: Contact Form 7, Yoast SEO, Wordfence Security, Limit Login Attempts" -ForegroundColor White
