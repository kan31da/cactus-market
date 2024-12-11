# Cactus Market

Cactus Market is a web-based application for buying and selling cacti. The app allows users to post listings for their cacti, review cacti posted by others, and purchase cacti from other users. The platform enforces specific rules to ensure fairness and a good user experience.

## Features

- **Post Cactus Listings**: Users can post their cacti for sale with details like name, price, and description.
- **Buy Cacti**: Registered and logged-in users can buy cacti listed by others.
- **Review System**: Every cactus listing can receive reviews, except from its owner.
- **User Restrictions**: Sellers cannot buy their own cacti.
- **Smooth Animations**: Engaging animations enhance the user experience throughout the app.

## Rules

1. You must be a **registered user** and logged in to buy cacti.
2. Users **cannot buy their own cacti**.
3. Only users who are not the owner of a cactus can leave reviews on it.

## Technologies Used

- **Frontend**: Angular
- **Backend**: Firebase
- **Database**: Firebase Firestore
- **Animations**: Angular Animations

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 22.11.0 or higher)  
  [Download Node.js](https://nodejs.org/)
  
- **Angular CLI** (version 18.2.12 or higher)  
  Install Angular CLI globally with:
  
  ```bash
  npm install -g @angular/cli

## Firebase Configuration

To use the app, you need to set up a Firebase project and provide the following configuration:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "<your_api_key>",
    authDomain: "<your_auth_domain>",
    projectId: "<your_project_id>",
    storageBucket: "<your_storage_bucket>",
    messagingSenderId: "<your_messaging_sender_id>",
    appId: "<your_app_id>"
  }
};
```

Replace the placeholders (e.g., `<your_api_key>`) with your Firebase project details.

## Installation and Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/kan31da/cactus-market.git
    ```

2. Navigate to the project directory:

    ```bash
    cd cactus-market
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create an `environment.ts` file in the `src/environments` directory and add your Firebase configuration:

    ```typescript
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "<your_api_key>",
        authDomain: "<your_auth_domain>",
        projectId: "<your_project_id>",
        storageBucket: "<your_storage_bucket>",
        messagingSenderId: "<your_messaging_sender_id>",
        appId: "<your_app_id>"
      }
    };
    ```

5. Start the development server:

    ```bash
    ng serve
    ```

## Usage

- Register and log in to your account.
- Post a cactus for sale by filling out the form.
- Browse available cacti and purchase your favorite ones.
- Leave reviews for cacti you find interesting (as long as you are not the owner).

## Contributing

Contributions are welcome! If you have ideas for improving the app, feel free to submit a pull request or create an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [kan31da](https://github.com/kan31da).
