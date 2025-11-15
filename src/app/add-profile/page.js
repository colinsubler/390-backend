import AddProfileForm from "@/components/AddProfileForm";
export const meta = {
  title: "Add Profile",
  description: "Create a new profile using the form below.",
};
export default function AddProfilePage() {
  return (
    <>
      <h1>Add Profile</h1>
      <AddProfileForm />
    </>
  );
}