if [ ! -d site ]
then
    git clone https://github.com/ProxyHaven/Haven.git site
    cd site
        git pull
        ./deps.sh
    cd ..
fi