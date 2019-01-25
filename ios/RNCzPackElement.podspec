
Pod::Spec.new do |s|
  s.name         = "RNCzPackElement"
  s.version      = "0.0.1"
  s.summary      = "RNCzPackElement"
  s.description  = "基于AppRegister包装一些自定义组件"
  s.homepage     = "https://github.com/chenzhe555/react-native-cz-pack-element"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author       = { "author" => "376811578@qq.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/chenzhe555/react-native-cz-pack-element.git", :tag => s.version }
  s.source_files = "*.{h,m}"
  s.requires_arc = true
  s.dependency "React"
  #s.dependency "others"

end

  