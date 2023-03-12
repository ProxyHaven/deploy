org="https://github.com/ProxyHaven/"

if [ ! -d site ]
then
    git clone "${org}/Haven.git" site
    cd site
        git pull
        ./deps.sh
    cd ..
fi