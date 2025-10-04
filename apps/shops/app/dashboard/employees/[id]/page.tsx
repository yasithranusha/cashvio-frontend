import { getEmployee } from "@/actions/employee";
import { getSelectedShopId } from "@/lib/shop";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { Role } from "@workspace/ui/enum/user.enum";

// Simple phone number formatting function
const formatPhoneNumber = (phone: string) => {
  if (!phone) return phone;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  // For international numbers, just return as-is with spaces
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Edit,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  RefreshCw,
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Shop Selected</h3>
          <p className="text-muted-foreground">
            Please select a shop or contact support to continue.
          </p>
        </div>
      </div>
    );
  }

  const employeeData = await getEmployee(params.id);

  if (employeeData.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Employee Not Found</h3>
          <p className="text-muted-foreground max-w-md">{employeeData.error}</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!employeeData.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Employee Not Found</h3>
          <p className="text-muted-foreground max-w-md">
            The employee you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const employee = employeeData.data;
  const roleLabel =
    employee.role === Role.SHOP_OWNER ? "Shop Owner" : "Shop Staff";
  const roleVariant =
    employee.role === Role.SHOP_OWNER ? "default" : "secondary";

  // Calculate employment duration
  const joinDate = new Date(employee.dateOfJoining);
  const now = new Date();
  const employmentDuration = Math.floor(
    (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  ); // months

  // Get initials for avatar
  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with improved design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-background to-muted/50 p-6 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="mb-2 sm:mb-0">
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback
                className={`text-2xl font-bold ${employee.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  {employee.isActive ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  <Badge variant={roleVariant as "default" | "secondary"}>
                    {roleLabel}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {employee.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`mailto:${employee.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`tel:${employee.contactNumber}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Link>
          </Button>
          <EmployeeDialog employee={employee} shopId={selectedShopId} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold">{joinDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenure</p>
                <p className="font-semibold">
                  {employmentDuration < 1
                    ? "< 1 month"
                    : `${employmentDuration} months`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {employee.salary && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-semibold font-mono">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-semibold">{roleLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact & Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="text-lg font-medium">{employee.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="text-lg font-medium">{employee.lastName}</p>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Contact Details
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <Link
                      href={`mailto:${employee.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {employee.email}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <Link
                      href={`tel:${employee.contactNumber}`}
                      className="text-primary hover:underline font-medium font-mono"
                    >
                      {formatPhoneNumber(employee.contactNumber)}
                    </Link>
                  </div>
                </div>

                {employee.emergencyContact && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm text-red-600">Emergency Contact</p>
                      <Link
                        href={`tel:${employee.emergencyContact}`}
                        className="text-red-700 hover:underline font-medium font-mono"
                      >
                        {formatPhoneNumber(employee.emergencyContact)}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {employee.address && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Address
                  </label>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm leading-relaxed">
                      {employee.address}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Employment & System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Employment & System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <div className="mt-1">
                  <Badge
                    variant={roleVariant as "default" | "secondary"}
                    className="text-sm"
                  >
                    {roleLabel}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={employee.isActive ? "default" : "destructive"}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Joining
                    </p>
                    <p className="font-medium">
                      {joinDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {employee.salary && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Salary
                      </p>
                      <p className="font-medium font-mono">
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium">
                      {new Date(employee.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>
                Employee ID: <span className="font-mono">{employee.id}</span>
              </p>
              <p>Created: {new Date(employee.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`mailto:${employee.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`tel:${employee.contactNumber}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call Employee
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://wa.me/${employee.contactNumber.replace(/\D/g, "")}`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Link>
            </Button>
            <EmployeeDialog employee={employee} shopId={selectedShopId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
