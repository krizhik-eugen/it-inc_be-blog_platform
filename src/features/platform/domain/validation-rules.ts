export const blogValidationRules = {
    name: {
        maxLength: 15,
    },
    description: {
        maxLength: 500,
    },
    websiteUrl: {
        pattern:
            /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
        errorMessagePattern: 'Website URL should be a valid URL',
        maxLength: 100,
    },
};

export const postValidationRules = {
    title: {
        maxLength: 30,
    },
    shortDescription: {
        maxLength: 100,
    },
    content: {
        maxLength: 1000,
    },
};

export const commentValidationRules = {
    content: {
        minLength: 20,
        maxLength: 300,
        errorMessageMinLength:
            'Comment content must be between 20 and 300 characters',
    },
};
