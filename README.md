#To redirect connections on port 8A to 8080:
`iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080`
`iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports 8080`
#To list rules:
`# iptables -t nat --line-numbers -n -L`

more information here:http://serverfault.com/questions/112795/how-to-run-a-server-on-port-80-as-a-normal-user-on-linux
