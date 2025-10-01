import { getEmployee } from "@/actions/employee";
import { getSelectedShopId } from "@/lib/shop";
import { Badge } from "@workspace/ui/components/ui/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Role } from "@workspace/ui/enum/user.enum";
import { formatPhoneNumber } from "react-phone-number-input";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
import { EmployeeDialog } from "@/components/employee/dialog/employee-dialog";
import { notFound } from "next/navigation";

interface EmployeeDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const employeeData = await getEmployee(params.id);

  if (employeeData.error || !employeeData.data) {
    notFound();
  }

  const employee = employeeData.data;
  const roleLabel =
    employee.role === Role.SHOP_OWNER ? "Shop Owner" : "Shop Staff";
  const roleVariant =
    employee.role === Role.SHOP_OWNER ? "default" : "secondary";

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {employee.firstName} {employee.lastName}
              {!employee.isActive && (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Employee Details</p>
          </div>
        </div>
        <EmployeeDialog employee={employee} shopId={selectedShopId} />
      </div>

      {/* Employee Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-lg">
                {employee.firstName} {employee.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Role
              </label>
              <div className="mt-1">
                <Badge variant={roleVariant as "default" | "secondary"}>
                  {roleLabel}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={employee.isActive ? "default" : "destructive"}>
                  {employee.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`mailto:${employee.email}`}
                  className="text-primary hover:underline"
                >
                  {employee.email}
                </Link>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`tel:${employee.contactNumber}`}
                  className="text-primary hover:underline"
                >
                  {formatPhoneNumber(employee.contactNumber)}
                </Link>
              </div>
            </div>
            {employee.emergencyContact && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Emergency Contact
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`tel:${employee.emergencyContact}`}
                    className="text-primary hover:underline"
                  >
                    {formatPhoneNumber(employee.emergencyContact)}
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date of Joining
              </label>
              <p className="mt-1">
                {new Date(employee.dateOfJoining).toLocaleDateString()}
              </p>
            </div>
            {employee.salary && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Salary
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-lg">
                    ${employee.salary.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Member Since
              </label>
              <p className="mt-1">
                {new Date(employee.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      {employee.address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{employee.address}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
