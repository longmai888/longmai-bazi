# 龙脉文化网站检查脚本
# 检查所有 HTML 文件的编码和 footer

$websiteDir = "D:\龙脉文化\website"
$htmlFiles = Get-ChildItem -Path $websiteDir -Filter *.html

$results = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $hasChinese = $content -match "[\u4e00-\u9fa5]"
    $hasFooter = $content -match "<footer"
    $hasLogo = $content -match "龙脉文化"

    # 检查是否为 UTF8 无 BOM
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $isUTF8 = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF

    $results += [PSCustomObject]@{
        File = $file.Name
        HasChinese = $hasChinese
        HasFooter = $hasFooter
        HasLogo = $hasLogo
        IsUTF8 = $isUTF8
        Size = $file.Length
    }
}

$results | Format-Table -AutoSize

# 输出问题文件
Write-Host "`n=== 问题文件 ==="
$results | Where-Object { -not $_.HasFooter -or -not $_.HasLogo } | ForEach-Object {
    Write-Host "$($_.File): 缺少 footer 或 logo"
}

Write-Host "`n检查完成！"
