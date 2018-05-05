#!/usr/bin/ruby -w
require 'pathname'
require 'fileutils'

files = Dir.glob("**/**.d.ts")
files = files.select do |file|
    file.index('src/') == nil
end

realpath = File.dirname(Pathname.new(__FILE__).realpath)

# 拷贝box2d和frame到libs中
frameFilePath = realpath + "/../../source/frame/binary/"
framDTS = frameFilePath + 'frame.d.ts'

old_frame_DTS = realpath + '/libs/frame.d.ts'
FileUtils.cp_r(old_frame_DTS,framDTS)

dragon = '../'
Dir.chdir(dragon)

packages = Dir.glob("**/**package.json")
packages.each do |file|
    if file =~ /(.*?)([^\\\/]+)$/ and file.index('dragon') == nil
        file = $1 + 'libs'
        find = false
        if File.directory?(file)
            find = true
            FileUtils.rm_r file
        end
        if find 
            FileUtils.mkdir_p file
        end

        files.each do |dts|
            name = nil
            if dts =~ /([^\/]+)$/
                name = $1
            end
            org_file = realpath + "/" + dts
            new_file = realpath + "/../" + file + "/" + name
            if new_file.index('thirds') == nil
                FileUtils.cp_r(org_file,new_file)
            end
        end
    end
end

libs = Dir.glob("**/bin/**/*.d.ts")
libs = libs.select do |file|
    file.index('dragon/bin') == nil
end