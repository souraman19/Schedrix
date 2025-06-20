# get all process listening on port 5000
netstat -ano | grep :5000

# kill a process with pId on gitbash
cmd.exe /c "taskkill /PID 26516 /F"


<-------------------------------------------------------------->



# `Option 1` (<Best for PROD>)   
(with ecosystem.config.js) => start all services/apps (no need to activate already "explicitly using the virtual environment's Python interpreter")
npm run start

# to Stop
pm2 stop all


# 1. Install PM2 globally (skip if already installed)
npm install -g pm2 pm2-windows-startup


<---------------------------------------------------->
# 2. Start all apps with PM2 
pm2 start ecosystem.config.js

# 3. Save the current process list to a dump file
pm2 save

# 4. Enable PM2 to auto-start on Windows boot
pm2-startup install
<-=----------------------------------------------------------->




# `Option 2` <NOT VERY GOOD FOR PROD>      (with help of npm) => start all services/apps (no need to activate already "explicitly using the virtual environment's Python interpreter")
npm run begin 

inside scripts=>
    // "begin": "pm2 start src/ml_models_service/app.py --name ml-service --interpreter \"./tf-env/Scripts/python\" && pm2 start src/index.ts --name server --interpreter node --interpreter-args \"-r ts-node/register\" && pm2 start src/lib/queues/reminderWorker.ts --name reminder-worker --interpreter node --interpreter-args \"-r ts-node/register\""




# Install PM2 globally (once)
npm install -g pm2



<------------------------------------------------------------------>
1. => start ml model with python interpreter >>>>
pm2 start src/ml_models_service/app.py \
  --name ml-service \
  --interpreter "./tf-env/Scripts/python"


2. => Start server with ts-node >>>>
pm2 start src/index.ts \
  --name server \
  --interpreter node \
  --interpreter-args "-r ts-node/register"

3. =>  Start reminder worker with ts-node >>>>>>>
pm2 start src/lib/queues/reminderWorker.ts \
  --name reminder-worker \
  --interpreter node \
  --interpreter-args "-r ts-node/register"
<---------------------------------------------------------------------->

# Restart processes
pm2 restart server
pm2 restart reminder-worker

# Stop processes
pm2 stop server
pm2 stop reminder-worker
pm2 stop all

# Reload processes (0 downtime)
pm2 reload server
pm2 reload reminder-worker

# View list of all processes
pm2 list

# View logs
pm2 logs                   # All logs
pm2 logs server
pm2 logs reminder-worker

# Save current process list (for resurrecting after reboot)
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# Run the command it prints after this to finalize auto-start

# Delete processes
pm2 delete server
pm2 delete reminder-worker
pm2 delete all


# to activate virtual env 
source tf-env/Scripts/activate
