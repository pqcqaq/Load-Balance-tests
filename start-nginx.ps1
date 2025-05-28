# 目标目录
$targetDir = "D:\dev\nginx"
$configFileName = "config.conf"
$targetConfigPath = Join-Path $targetDir $configFileName

# 获取当前脚本目录
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceConfigPath = Join-Path $scriptDir "nginx\$configFileName"

# 确保目标目录存在
if (-not (Test-Path $targetDir)) {
    New-Item -Path $targetDir -ItemType Directory | Out-Null
}

# 复制配置文件
Write-Host "Copying config file to $targetConfigPath..."
Copy-Item -Path $sourceConfigPath -Destination $targetConfigPath -Force

# 确保日志和临时目录存在
$dirs = @(
    "$targetDir\logs",
    "$targetDir\temp\client_body_temp"
)
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# 切换到Nginx所在目录
Set-Location $targetDir
Write-Host "Changed directory to $targetDir"

# 启动 Nginx
Write-Host "Starting Nginx with config: $targetConfigPath"
$nginxProcess = Start-Process -FilePath "nginx" `
    -ArgumentList "-c `"$targetConfigPath`"" `
    -NoNewWindow -PassThru

# 注册 Ctrl+C 事件，优雅退出
$stopEvent = Register-EngineEvent -SourceIdentifier Console_CancelKeyPress -Action {
    Write-Host "`nStopping Nginx..."
    & nginx -s quit
    Write-Host "Nginx stopped."
    Unregister-Event -SourceIdentifier Console_CancelKeyPress
    exit
}

Write-Host "Nginx is running. Press Ctrl+C to stop..."

while ($true) {
    Start-Sleep -Seconds 1
}
