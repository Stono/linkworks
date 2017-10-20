# linkworks
Yeahhhhhh, that's right.  I went there and diluted that brand.

## Purpose
A simple service (Google Cloud Function) that allows you to register one url to 307 redirect to another.  To solve a temporary problem we have.

## Installation
Run `npm install`.

### Deploying
We deploy using the serverless framework, so make sure your `gcloud auth login` is setup, and your `gcloud config get project` is targetting the right projecti and you've updated the project in [serverless.yml](serverless.yml) and simply run `npm run deploy`.

The serverless framework uses service accounts in order to deploy, the deploy script will:

  - Look up your App Engine default service account
  - Generate an account key
  - Download it
  - Deploy the function
  - Revoke the key

### Using the service
#### Setting up a redirect
Support we want to redirect `/test` on our function to `https://www.google.com`, we'd do it with a PUT:

`curl -X PUT -d '' -kv https://us-central1-<your-project>.cloudfunctions.net/linkworks/test?target=https://www.google.com`

Then if we were to GET it, we'd see:

```
$ curl -v https://us-central1-<your-project>.cloudfunctions.net/linkworks/test
> GET /linkworks/test HTTP/1.1
> User-Agent: curl/7.29.0
> Accept: */*
>
< HTTP/1.1 307 OK
< Content-Type: text/plain; charset=utf-8
< Function-Execution-Id: g4rw1sstp4yy
< Location: https://www.google.com
< Vary: Accept
< X-Powered-By: Express
< X-Cloud-Trace-Context: 6577176597a47fc8d2ae0bd8dea8c143
< Date: Fri, 20 Oct 2017 11:51:12 GMT
< Server: Google Frontend
< Content-Length: 57
< Alt-Svc: quic=":443"; ma=2592000; v="39,38,37,35"
<
Temporary Redirect. Redirecting to https://www.google.com
```

MAGIC.
