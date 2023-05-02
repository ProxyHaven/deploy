org="https://github.com/NebulaServices/"

if [ ! -d site ]
then
    git clone "${org}/aero-site.git" site
fi

cd site
    git pull
	./deps.sh
cd ..