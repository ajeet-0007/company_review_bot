class UserProfile {
        constructor(name, age) {
            this.name = name;
            this.age = age;
    
            // The list of companies the user wants to review.
            this.companiesToReview = [];
        }
    }
    
module.exports.UserProfile = UserProfile;