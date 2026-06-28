import pandas as pd
import random
import os

# Create data folder inside backend
os.makedirs("data", exist_ok=True)

def generate_bin_data():
    issuers = {
        "Chase": [414700, 414720, 414740, 414760],
        "Bank of America": [410000, 410020, 410040, 410060],
        "Wells Fargo": [411800, 411820, 411840, 411860],
        "Citibank": [412800, 412820, 412840, 412860],
        "Capital One": [414000, 414020, 414040, 414060],
        "American Express": [340000, 370000, 378000],
        "Discover": [601100, 601120, 601140],
        "Visa": [440000, 450000, 460000, 470000],
        "Mastercard": [510000, 520000, 530000, 540000],
        "HSBC": [413000, 413020, 413040]
    }
    
    card_types = ["Visa", "Mastercard", "Amex", "Discover"]
    countries = ["US", "CA", "UK", "DE", "FR", "AU", "IN", "JP", "BR", "MX"]
    
    decline_reasons = [
        "Insufficient funds", "Card expired", "Invalid CVV",
        "Card blocked", "Transaction limit exceeded", "Suspected fraud",
        "Merchant restricted", "Invalid card number", "Card not activated"
    ]
    
    data = []
    bin_id = 1
    
    for issuer, bin_ranges in issuers.items():
        for bin_start in bin_ranges:
            for i in range(5):
                bin_num = bin_start + i
                record = {
                    "bin_id": bin_id,
                    "bin": f"{bin_num:06d}",
                    "issuer": issuer,
                    "card_type": random.choice(card_types),
                    "country": random.choice(countries),
                    "is_commercial": random.choice([True, False]),
                    "is_prepaid": random.choice([True, False]),
                    "decline_rate": round(random.uniform(0.01, 0.15), 3),
                    "avg_transaction": round(random.uniform(10, 500), 2),
                    "top_decline_reason": random.choice(decline_reasons)
                }
                data.append(record)
                bin_id += 1
    
    return pd.DataFrame(data)

df = generate_bin_data()
df.to_csv("data/bin_data.csv", index=False)
print(f"✅ Generated {len(df)} BIN records")
print("📁 Saved to data/bin_data.csv")