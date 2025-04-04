import FormDisplay from '../../components/FormDisplay';

const FormPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;
  return <FormDisplay formId={id}/>;
};

export default FormPage;
