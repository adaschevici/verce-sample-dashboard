'use server';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string().nonempty(),
  amount: z.coerce.number().positive(),
  status: z.enum(['paid', 'pending']),
  date: z.string().optional(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  console.log('Creating invoice:', { customerId, amountInCents, status });
}

