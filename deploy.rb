puts "Compiling"
`ruby compile.rb http://player.mark423.com/`
puts "Deploying"
`s3cmd put -r --acl-public --guess-mime-type build/* s3://mark423-player/`
puts "Done!"