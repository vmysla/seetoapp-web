// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

// HTTP endpoint: /firstcontact
exports.firstcontact = onRequest({region: "europe-west1"}, async (req, res) => {
    const jobId = req.query.jobId;
    const phone = req.query.phone;
    const notes = req.query.notes || "";

    // Verify mandatory parameters
    if (!jobId || !phone) {
        res.status(400).send("Bad request"); // Obscure message for security reasons
        return;
    }
    try {
        // Push the new message into Firestore using the Firebase Admin SDK.
        let document = {jobId, phone, notes};
        const writeResult = await getFirestore()
            .collection("first-contact")
            .add(document);

        // HTTP Response
        res.json({result: `First contact data saved with ID: ${writeResult.id}`});
    } catch (error) {
        logger.error(`Error writing document: ${JSON.stringify(document) }`, error);
        res.status(500).send("Something went wrong");
    }
});
