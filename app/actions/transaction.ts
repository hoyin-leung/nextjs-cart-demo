"use server"

import connectToDatabase from "@/lib/db";
import { handleError } from "@/lib/util";
import Stripe from "stripe"

const collection = 'order'

export async function checkout(transaction: TransactionProps) {

  if(transaction.productItems===undefined) return

    const productsArray = transaction.productItems.map(item => (
        {
            price_data: {
                currency: 'hkd',
                unit_amount: item.price * 100,
                product_data: {
                    name: item.name,
                    description: item.description,
                    //images: [`image網址`]
                }
            },
            quantity: item.quantity
        }
    )); 

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
        line_items: productsArray,
        /* metadata: {
            name: transaction.productName,
            slug: transaction.includedProductSlugs
        }, */
        customer_email: transaction.customerEmail,
        locale:'zh-HK',
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thankyou`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
        allow_promotion_codes: true
    })
    
    return session.url
}
export async function getAll() {
    try {
      const { db } = await connectToDatabase();
      const data = await db
      .collection(collection)
      .find({})
      .toArray();
  
      if (data) return data
      return false
  
    } catch (error) {
      handleError(error);
    }
  }