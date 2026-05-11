# fix-encodage.ps1
# Double-cliquez sur ce fichier pour corriger l'encodage de tous les fichiers HTML
# Clic droit > Executer avec PowerShell

$dossier = Split-Path -Parent $MyInvocation.MyCommand.Path
$fichiers = Get-ChildItem -Path $dossier -Filter "*.html"

foreach ($fichier in $fichiers) {
    $contenu = [System.IO.File]::ReadAllText($fichier.FullName, [System.Text.Encoding]::GetEncoding(1252))
    [System.IO.File]::WriteAllText($fichier.FullName, $contenu, [System.Text.Encoding]::UTF8)
    Write-Host "Corrige: $($fichier.Name)"
}

Write-Host ""
Write-Host "TERMINE ! Tous les fichiers HTML sont maintenant en UTF-8 correct."
Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
