const tl = require('vsts-task-lib/task');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

if(!process.env.AWS_REGION | !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY){
	tl.setResult(tl.TaskResult.Failed, "Must set AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables");
}else{
	const s3 = new S3();

	s3.upload({
		Bucket: tl.getInput('bucketName', true),
		Key: tl.getInput('bucketKey', true),
		Body: fs.createReadStream(tl.getPathInput('targetFile', true))
	})
	.promise()
		.then(data => {
			console.log('Uploaded File', data)
			tl.setVariable('S3LastUploadedURL', data.Location)
			tl.setResult(tl.TaskResult.Succeeded, data.Location)
		})
		.catch(err => tl.setResult(tl.TaskResult.Failed, err))
}
