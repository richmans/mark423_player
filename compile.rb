def write_file(filename, output)
  input = File.open(filename, 'r')
  while line = input.gets
    output.puts line
  end
  input.close
end
begin
  Dir.mkdir("build")
rescue Errno::EEXIST
end
output_file = File.open("build/mark423-player.js", 'w')
puts "Writing jquery"
write_file("lib/jquery-1.9.1.min.js", output_file)
puts "Writing jplayer"
write_file("lib/jquery.jplayer.min.js", output_file)
puts "Writing application js"
write_file("lib/application.js", output_file)

output_file.close
puts "All done!"
