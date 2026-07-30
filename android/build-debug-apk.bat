@echo off
setlocal EnableExtensions

cd /d "%~dp0"

echo === goatApp debug APK build ===
echo.

if not defined JAVA_HOME (
  if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
  )
)

if defined JAVA_HOME (
  set "PATH=%JAVA_HOME%\bin;%PATH%"
)

where java >nul 2>&1
if errorlevel 1 (
  echo ERROR: java.exe not found. Install JDK 17 and set JAVA_HOME.
  echo Example: set JAVA_HOME=C:\Program Files\Java\jdk-17
  exit /b 1
)

if not exist "local.properties" (
  if defined ANDROID_HOME (
    >local.properties echo sdk.dir=%ANDROID_HOME:\=/%
    echo Created local.properties from ANDROID_HOME
  ) else if exist "%LOCALAPPDATA%\Android\Sdk" (
    >local.properties echo sdk.dir=%LOCALAPPDATA:\=/%/Android/Sdk
    echo Created local.properties from default SDK path
  ) else (
    echo ERROR: Android SDK not found.
    echo Create android\local.properties with:
    echo sdk.dir=C:/Users/YOUR_USER/AppData/Local/Android/Sdk
    exit /b 1
  )
)

if not exist "gradle\wrapper\gradle-wrapper.jar" (
  echo ERROR: Missing gradle\wrapper\gradle-wrapper.jar
  exit /b 1
)

echo Java:
java -version
echo.
echo Building assembleDebug...
echo.

rem Prefer jar invoke so a broken gradlew.bat cannot silently fail
java -classpath "gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain assembleDebug --stacktrace
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo BUILD FAILED with code %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo.
echo BUILD SUCCESSFUL
echo APK:
echo   %cd%\app\build\outputs\apk\debug\app-debug.apk
exit /b 0
