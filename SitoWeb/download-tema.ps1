param(
    [string]$FtpHost,
    [string]$FtpUser,
    [string]$FtpPassword,
    [string]$OutputPath = "$PSScriptRoot\wp-content\themes\downloadato",
    [string]$RemoteThemePath = "/www/studiolegalemandroneniglio.it/htdocs/wp-content/themes"
)

if (-not $FtpHost) { $FtpHost = Read-Host "Host FTP (es. ftp.studiolegalemandroneniglio.it)" }
if (-not $FtpUser) { $FtpUser = Read-Host "Utente FTP" }
if (-not $FtpPassword) { $SecurePass = Read-Host "Password FTP" -AsSecureString; $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass); $FtpPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR); [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) }

$FtpRoot = "ftp://$FtpHost"

Write-Host "`n=== Scarico temi da Aruba ===" -ForegroundColor Cyan
Write-Host "Host: $FtpHost" -ForegroundColor Gray
Write-Host "Destinazione: $OutputPath" -ForegroundColor Gray
Write-Host "Remoto: $RemoteThemePath" -ForegroundColor Gray
Write-Host ""

# Crea directory output
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null

function List-FtpDir($dir) {
    $uri = New-Object System.Uri("$FtpRoot/$dir")
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
    $req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPassword)
    $req.UsePassive = $true
    $req.UseBinary = $true
    $req.KeepAlive = $false
    $resp = $req.GetResponse()
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $lines = $reader.ReadToEnd()
    $reader.Close()
    $resp.Close()
    return $lines -split "`r`n|`n" | Where-Object { $_ -ne '' }
}

function Download-FtpDir($remoteDir, $localDir) {
    New-Item -ItemType Directory -Path $localDir -Force | Out-Null
    try {
        $entries = List-FtpDir $remoteDir
    } catch {
        return
    }

    foreach ($line in $entries) {
        $parts = $line -split '\s+'
        $name = $parts[-1]
        $isDir = $line -match '^d' -or $line -match '<DIR>'

        if ($name -eq '.' -or $name -eq '..') { continue }

        $remotePath = "$remoteDir/$name"
        $localPath = "$localDir/$name"

        if ($isDir) {
            Write-Host "  [DIR]  $remotePath" -ForegroundColor Yellow
            Download-FtpDir $remotePath $localPath
        } else {
            Write-Host "  [FILE] $name" -ForegroundColor Gray
            try {
                $uri = New-Object System.Uri("$FtpRoot/$remotePath")
                $wc = New-Object System.Net.WebClient
                $wc.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPassword)
                $wc.DownloadFile($uri, $localPath)
                $wc.Dispose()
            } catch {
                Write-Host "    ERRORE: $_" -ForegroundColor Red
            }
        }
    }
}

# First list themes directory to see available themes
Write-Host "Elenco temi disponibili su $RemoteThemePath ..." -ForegroundColor Yellow
$themes = List-FtpDir $RemoteThemePath
$themeDirs = @()
foreach ($line in $themes) {
    if ($line -match '^d') {
        $parts = $line -split '\s+'
        $name = $parts[-1]
        if ($name -ne '.' -and $name -ne '..') {
            $themeDirs += $name
        }
    }
}

if ($themeDirs.Count -eq 0) {
    Write-Host "Nessun tema trovato. Provo a scaricare tutto $RemoteThemePath ..." -ForegroundColor Yellow
    Download-FtpDir $RemoteThemePath $OutputPath
} else {
    Write-Host "Temi trovati:" -ForegroundColor Green
    for ($i = 0; $i -lt $themeDirs.Count; $i++) {
        Write-Host "  [$i] $($themeDirs[$i])" -ForegroundColor White
    }
    $choice = Read-Host "`nQuale tema scaricare? (indice, oppure 'all' per tutti, default: 0)"
    if ($choice -eq 'all') {
        Download-FtpDir $RemoteThemePath $OutputPath
    } else {
        if ($choice -eq '') { $choice = 0 }
        $idx = [int]$choice
        if ($idx -ge 0 -and $idx -lt $themeDirs.Count) {
            $selected = $themeDirs[$idx]
            Write-Host "`nScaricamento tema: $selected" -ForegroundColor Green
            Download-FtpDir "$RemoteThemePath/$selected" "$OutputPath/$selected"
            Write-Host "`nTema scaricato in: $OutputPath\$selected" -ForegroundColor Green
        } else {
            Write-Host "Indice non valido" -ForegroundColor Red
        }
    }
}
