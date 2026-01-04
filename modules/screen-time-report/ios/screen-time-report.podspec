Pod::Spec.new do |s|
  s.name            = 'screen-time-report'
  s.version         = '0.0.1'
  s.summary         = 'A module to provide screen time reports'
  s.description     = 'A module to provide screen time reports for iOS using Expo'
  s.author          = { 'Hunter Pageau' => 'thisishp64@gmail.com' }
  s.homepage        = 'https://github.com/WilsonC67/StressFormiOS'
  s.license         = { :type => 'MIT' }

  s.platforms       = { :ios => '16.6' }
  s.source          = { :path => '.' }
  s.static_framework = true
  s.swift_version   = '5.0'

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{swift,h,m}'
end
