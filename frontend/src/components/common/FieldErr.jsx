import { ErrorMessage } from 'formik'
export default function FieldErr({ name }) {
  return (
    <ErrorMessage name={name}>
      {msg => <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{msg}</p>}
    </ErrorMessage>
  )
}
