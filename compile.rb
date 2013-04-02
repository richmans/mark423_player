
def write_file(filename, output, process=false)
  input = File.open(filename, 'r')
  while line = input.gets
    line.gsub!("[root_url]", $root_url) if process
    output.puts line
  end
  input.close
end

def process_line(line)
  line.gsub!("[root_url]", $root_url)
  line.gsub! '"', '\"'
  line.strip
end

def write_css_string(input_filename, output)
  output.puts "mark423Styles = '<style>' + "
  input = File.open(input_filename, 'r')
  while line = input.gets
    line = process_line(line)
    output.puts "\"#{line}\" + \n"
  end
  output.puts '"</style>";'
  input.close
end

def write_html_string(input_filename, output)
  output.puts "mark423Interface = '' + "
  input = File.open(input_filename, 'r')
  while line = input.gets
    line = process_line(line)
    output.puts "\"#{line}\" + \n"
  end
  output.puts '"";'
  input.close
end

def write_tail(output)
  output.puts("console.log('Mark423 player compiled at #{Time.now.to_s}');")
end

def prepare(args)
  raise "Please define a root url" if args.size < 1 
  $root_url = args.first
  $root_url += '/' unless ($root_url[-1] == '/')
  begin
    Dir.mkdir("build")
  rescue Errno::EEXIST
  end
end

def main(args)
  prepare(args)
  puts "== Ready to build for #{$root_url} =="
  output_file = File.open("build/mark423-player.js", 'w')
  puts "Writing jquery"
  write_file("lib/jquery-1.9.1.min.js", output_file)
  puts "Writing jplayer"
  write_file("lib/jquery.jplayer.min.js", output_file)
  puts "Writing css"
  write_css_string("stylesheets/mark423-player.css", output_file)
  puts "Writing html"
  write_html_string("html/player.html", output_file)
  puts "Writing application js"
  write_file("lib/application.js", output_file, true)
  puts "Writing tail"
  write_tail(output_file)
  output_file.close
  puts "Copying fonts"
  `cp -r fonts build`
  puts "Copying flash"
  `cp -r flash build`
  # how about some minimization here?
  puts "All done!"
  # s3cmd put -r --acl-public --guess-mime-type * s3://mark423-player/
end

main(ARGV)