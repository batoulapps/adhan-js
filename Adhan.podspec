Pod::Spec.new do |s|
  s.name             = "Adhan"
  s.version          = "0.1.5"
  s.summary          = "High precision prayer time library."

  s.description      = <<-DESC
                      Adhan is a high precision prayer time
                      library with all astronomical equations
                      from cited authoritative sources. Adhan
                      is well tested and available in multiple
                      languages. For iOS and OS X apps Adhan
                      is available in Swift and with an Objective-C
                      compatible Swift interface.
                     DESC

  s.homepage         = "https://github.com/batoulapps/Adhan"
  s.license          = 'MIT'
  s.author           = { 'Batoul Apps' => 'support@batoulapps.com' }
  s.source           = { :git => "https://github.com/batoulapps/Adhan.git", :tag => "swift-" + s.version.to_s }

  s.social_media_url = 'https://twitter.com/batoulapps'

  s.ios.deployment_target = '8.0'
  s.osx.deployment_target = '10.9'
  s.watchos.deployment_target = '2.0'
  s.tvos.deployment_target = '9.0'

  s.source_files =  'Swift/Sources/Adhan.swift',
                    'Swift/Sources/AdhanObjc.swift'
  
end
