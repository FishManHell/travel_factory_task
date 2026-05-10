import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const requesterFormResolver = yupResolver(
  yup.object({
    date: yup
      .array()
      .of(yup.date().required())
      .length(2, 'Select start and end date')
      .test('not-in-past', 'Start date cannot be in the past', (v) =>
        !!v && v[0] instanceof Date && v[0] >= today,
      )
      .test('end-after-start', 'End date must be after start date', (v) =>
        !!v && v[0] instanceof Date && v[1] instanceof Date && v[1] >= v[0],
      )
      .required('Date is required'),
    reason: yup.string().max(500, 'Reason is too long').optional(),
  }),
)
