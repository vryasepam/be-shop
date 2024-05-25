export const handler = (event, context, callback) => {
    console.log('Auth event: ', event);

    const { authorizationToken, methodArn } = event;
    const encodedCredentials = authorizationToken.split(' ')[1];

    if (event.type !== 'TOKEN') {
        callback('Unauthorized');
    }

    try {
        const tokenDecoded = Buffer.from(encodedCredentials, 'base64').toString();
        const [username, password] = tokenDecoded.split('=');
    
        const effect = process.env[username] && process.env[username] === password ? 'Allow' : 'Deny';

        const policy = generatePolicy(encodedCredentials, methodArn, effect);

        callback(null, policy);

    } catch(error) {
        console.log(error);
        callback(`Unauthorized: ${error.message}`);
    }
};

const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  });
