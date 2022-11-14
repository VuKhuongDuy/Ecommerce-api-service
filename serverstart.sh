yarn start > nodeserver.log 2>&1 &

# keep waiting until the server is started
# (in this case wait for mongodb://localhost:27017/app-test to be logged)
while ! grep -q "Nest application successfully started" nodeserver.log
do
  sleep .1
done
echo -e "server has started\n"
exit
