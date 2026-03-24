# 龙脉文化网站全面检查脚本
# 检查所有 HTML 页面的编码、footer、功能

$websiteDir = "D:\龙脉文化\website"
$htmlFiles = Get-ChildItem -Path $websiteDir -Filter *.html

Write-Host "开始检查 $($htmlFiles.Count) 个 HTML 文件..."

$results = @()
$issues = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) {
        $results += [PSCustomObject]@{
            File = $file.Name
            Status = "EMPTY"
            Issue = "文件为空"
        }
        $issues += "空文件: $($file.Name)"
        continue
    }

    # 检查 UTF-8 编码
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $hasBOM = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $isUTF8 = [System.Text.Encoding]::UTF8.GetString($bytes) -eq $content

    # 检查关键元素
    $hasDoctype = $content -match "<!DOCTYPE html>"
    $hasCharset = $content -match 'charset="UTF-8"'
    $hasFooter = $content -match "<footer"
    $hasLogo = $content -match "龙脉文化"
    $hasContact = $content -match "longmai@foxmail.com"
    $hasPhone = $content -match "400-XXX-XXXX"
    $hasICP = $content -match "ICP"

    # 检查常见错误（乱码字符）
    $hasGarbled = $content -match "[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|�|"

    $status = "OK"
    $issue = ""

    if (-not $hasDoctype) { $status = "WARN"; $issue += "缺少DOCTYPE; " }
    if (-not $hasCharset) { $status = "WARN"; $issue += "缺少charset=UTF-8; " }
    if (-not $hasFooter) { $status = "ERROR"; $issue += "缺少footer; " }
    if (-not $hasLogo) { $status = "ERROR"; $issue += "缺少logo; " }
    if (-not $hasContact) { $status = "WARN"; $issue += "缺少联系方式; " }
    if (-not $hasPhone) { $status = "WARN"; $issue += "缺少电话; " }
    if (-not $hasICP) { $status = "WARN"; $issue += "缺少ICP; " }
    if ($hasGarbled) { $status = "ERROR"; $issue += "有乱码; " }

    $results += [PSCustomObject]@{
        File = $file.Name
        Status = $status
        Issue = $issue
        Size = $file.Length
        HasFooter = $hasFooter
        HasLogo = $hasLogo
    }

    if ($status -ne "OK") {
        $issues += "$($file.Name): $issue"
    }
}

Write-Host "`n=== 检查结果 ==="
$results | Format-Table -AutoSize

Write-Host "`n=== 问题汇总 ==="
if ($issues.Count -eq 0) {
    Write-Host "✅ 所有文件正常！" -ForegroundColor Green
} else {
    Write-Host "发现 $($issues.Count) 个问题文件："
    $issues | ForEach-Object { Write-Host "  ❌ $_" -ForegroundColor Red }
}

Write-Host "`n检查完成！"

# 输出问题文件列表到文件
$results | Where-Object { $_.Status -ne "OK" } | Export-Csv -Path "website_issues.csv" -NoTypeInformation -Encoding UTF8
Write-Host "问题列表已保存到 website_issues.csv"
