def write_file(filename, output)
  input = File.open(filename, 'r')
  while line = input.gets
    output.puts line
  end
  input.close
end

def write_html_string(input_filename, output)
  output.puts "mark423Interface = '' + "
  input = File.open(input_filename, 'r')
  while line = input.gets
    line.gsub! '"', '\"'
    output.puts "\"#{line.strip}\" + \n"
  end
  output.puts '"";'
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
puts "Writing html string"
write_html_string("html/player.html", output_file)
puts "Writing application js"
write_file("lib/application.js", output_file)
output_file.close

# how about some minimization here?
puts "All done!"
