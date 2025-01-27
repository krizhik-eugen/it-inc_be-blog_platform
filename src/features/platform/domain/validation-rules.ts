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
