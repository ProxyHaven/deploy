if [ ! -d proxy ]
then
    git clone https://github.com/ProxyHaven/aero-backends.git proxy
    cd proxy
        git pull > /dev/null 2>&1
    cd ..
fi

if [ ! -d site ]
then
    git clone https://github.com/ProxyHaven/Haven.git site
    cd site
        git pull > /dev/null 2>&1
        ./deps.sh
    cd ..
fi