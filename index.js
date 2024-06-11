const express = require("express");
require("dotenv").config();
const app = express();
const PORT = 5000;
const db = require('./dbconfig');
const { coreApi } = require('./midtransconfig');

app.use(express.json());

//routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to LaNa Midtrans" });
});

app.post("/transaksi", async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            success: false,
            message: "Content can not be empty!",
        });
    }

    const client = await db.connect();
    try {
        const timestamp = Date.now();
        const orderId = `ORDER-${timestamp}`;

        req.body.transaction_details = {
            ...req.body.transaction_details,
            order_id: orderId
        };

        coreApi.charge(req.body).then(async (midtrans) => {

            await client.query('BEGIN');
            const query = 'INSERT INTO "tb_transaksi" ("order_id", "nama", "transaction_status", "response_midtrans") VALUES ($1, $2, $3, $4) RETURNING *';
            const data = await client.query(query, [midtrans.order_id, req.body.customer_details.name, midtrans.transaction_status, JSON.stringify(midtrans)]);
            await client.query('COMMIT');

            return res.status(200).json({ success: true, message: "Berhasil melakukan charge transaction!", data: data.rows[0] });

        }).catch((error) => {
            return res.status(400).json({ success: false, message: error.message, });
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing transaction:', error);
        return res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
});

app.use((req, res) => {
    return res.status(404).send('404 Not Found !');
});

// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});