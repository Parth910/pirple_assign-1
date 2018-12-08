var environments={};

environments.staging = {
    'httpPort' : 3000,
    'httpsPort':3001,
    'envName' :'staging'
}

environments.production = {
    'httpPort' :5000,
    'httpsPort':5001,
    'envName' : 'production'
}

var currentenvironment=typeof(process.env.NODE_ENV)  == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

var environmentToExport=typeof(environments[currentenvironment]) == 'object' ? environments[currentenvironment] : environments.staging;

module.exports = environmentToExport;   