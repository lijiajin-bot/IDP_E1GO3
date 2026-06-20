export async function sendSMS(
  studentName: string,
  action: string,
  equipmentName: string
) {
  await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        studentName,
        action,
        equipmentName,
      }),
    }
  );
}