import { aws4Interceptor } from 'aws4-axios';
import axios from 'axios';

// The HTTP API is protected by `authorizer: type: aws_iam`, so every e2e
// request has to carry a SigV4 signature. Registering the interceptor here
// (rather than in jest.setup.e2e.js) is deliberate: that file is globalSetup
// and runs in its own process, so an interceptor added there would never
// reach the tests.
axios.interceptors.request.use(
  aws4Interceptor({
    options: {
      region: process.env.AWS_REGION || 'us-east-1',
      service: 'execute-api',
    },
  }),
);
