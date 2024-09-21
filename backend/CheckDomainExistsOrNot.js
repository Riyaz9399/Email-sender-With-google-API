
import dns from 'dns';

 const checkDomainExists = (email) => {
    const domain = email.split('@')[1];
    return new Promise((resolve, reject) => {
        dns.resolveMx(domain, (error, addresses) => {
            if (error) {
                reject(false);
            } else {
                resolve(addresses.length > 0);
            }
        });
    });
};


export  const validateEmailFormat = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export default checkDomainExists;
