import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageTitle from "@/components/ui/PageTitle";
import { LoaderIcon, PlusIcon } from "lucide-react";
import UserTable from "./UserTable";
import { useEffect, useState } from "react";
import { User } from "../types";
import CreateEditUserModal from "./CreateEditUserModal";
import { createUser, deleteUser, getAllUsers, updateUser } from "../services";
import { UserFormValues } from "../schemas";
import { toast } from "sonner";

const UserManagement = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined | null>(
    null
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onEditUserClicked = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const onDeleteUserClicked = async (user: User) => {
    try {
      await deleteUser(user.id);
      await fetchData();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(`Error while deleting user`);
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="flex flex-col items-center gap-8"
    >
      <Card className="px-16 w-full flex flex-row justify-between items-center">
        <PageTitle title="User Management" />
        <Button
          className="bg-black text-white"
          style={{ color: "white" }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon /> Create User
        </Button>
      </Card>
      <div className="flex-1 w-full">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoaderIcon className="animate-spin" />
          </div>
        ) : (
          <UserTable
            users={users}
            onEditUserClicked={onEditUserClicked}
            onDeleteUserClicked={onDeleteUserClicked}
          />
        )}
      </div>
      <CreateEditUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser ?? undefined}
        onSave={async (values: UserFormValues) => {
          if (selectedUser) {
            try {
              await updateUser(selectedUser?.id, values);
              toast.success("User updated successfully");
            } catch (error) {
              console.error(error);
              toast.error("Error while updateing the user");
            }
          } else {
            try {
              await createUser(values);
              toast.success("User created successfully");
            } catch (error) {
              console.error(error);
              toast.error("Error while creating the user");
            }
          }
          await fetchData();
        }}
      />
    </div>
  );
};

export default UserManagement;
