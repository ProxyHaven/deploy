FROM denoland/deno:1.10.3

WORKDIR /

USER deno

ADD . .

CMD ["run", "--allow-run", "--allow-net", "--allow-env", "--allow-read"]