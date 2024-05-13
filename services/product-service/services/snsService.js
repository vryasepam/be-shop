import { SNSClient } from "@aws-sdk/client-sns";

import { PublishCommand } from '@aws-sdk/client-sns';

const getSnsClient = () => {
    const isOfflineSetup = process.env.IS_OFFLINE === 'true';

    if(isOfflineSetup) return null;
    
    return new SNSClient({ region: process.env.AWS_REGION });
}

const snsClient = getSnsClient();

class SnsService {
    async publishProductCreationNotification({ message, totalCount }) {
        const command = new PublishCommand({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Subject: 'Product creation',
            Message: message,
            MessageAttributes: {
                totalCount: {
                  DataType: 'Number',
                  StringValue: totalCount.toString(),
                },
              },
          });

          await snsClient.send(command);
    }
}

export default SnsService;
