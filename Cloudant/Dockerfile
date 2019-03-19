from ibmcom/cloudant-developer:latest
workdir /scripts
copy startup.sh .
run touch /root/.bashrc && echo "cd /scripts" >> /root/.bashrc && echo "sh startup.sh" >> /root/.bashrc && echo "exit" >> /root/.bashrc
expose 80



