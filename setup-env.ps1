# Script PowerShell pour configurer le fichier .env
Write-Host "Configuration du fichier .env pour MySQL" -ForegroundColor Cyan
Write-Host ""

$envPath = Join-Path $PSScriptRoot ".env"

if (-not (Test-Path $envPath)) {
    Write-Host "ERREUR: Le fichier .env n'existe pas !" -ForegroundColor Red
    Write-Host "   Creation a partir de env.example..." -ForegroundColor Yellow
    Copy-Item (Join-Path $PSScriptRoot "env.example") $envPath
}

Write-Host "Contenu actuel du fichier .env:" -ForegroundColor Yellow
Get-Content $envPath | Select-String -Pattern "DB_|JWT_"
Write-Host ""

# Vérifier si DB_PASSWORD est vide
$envContent = Get-Content $envPath -Raw
if ($envContent -match "DB_PASSWORD=\s*$" -or $envContent -match "DB_PASSWORD=$") {
    Write-Host "ATTENTION: DB_PASSWORD est vide ou non defini" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Si MySQL n'a PAS de mot de passe, laissez DB_PASSWORD= vide"
    Write-Host "2. Si MySQL a un mot de passe, modifiez manuellement le fichier .env"
    Write-Host ""
    
    $choice = Read-Host "Voulez-vous entrer un mot de passe maintenant ? (o/n)"
    
    if ($choice -eq "o" -or $choice -eq "O") {
        $password = Read-Host "Entrez le mot de passe MySQL pour 'root'" -AsSecureString
        $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        )
        
        # Mettre à jour le fichier .env
        $newContent = $envContent -replace "DB_PASSWORD=\s*", "DB_PASSWORD=$plainPassword"
        Set-Content -Path $envPath -Value $newContent -NoNewline
        
        Write-Host ""
        Write-Host "OK: Fichier .env mis a jour !" -ForegroundColor Green
        Write-Host "   DB_PASSWORD a ete defini" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Pour modifier manuellement:" -ForegroundColor Yellow
        Write-Host "   1. Ouvrez le fichier: $envPath"
        Write-Host "   2. Trouvez la ligne: DB_PASSWORD="
        Write-Host "   3. Ajoutez votre mot de passe: DB_PASSWORD=votre_mot_de_passe"
        Write-Host ""
    }
} else {
    Write-Host "OK: DB_PASSWORD est deja defini dans le fichier .env" -ForegroundColor Green
}

Write-Host ""
Write-Host "Pour tester la connexion MySQL, executez:" -ForegroundColor Cyan
Write-Host "   node check-env.js" -ForegroundColor White
Write-Host ""

