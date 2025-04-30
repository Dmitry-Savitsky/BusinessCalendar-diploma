using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessCalendar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookHasUserPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_BookHasUsers",
                table: "BookHasUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookHasUsers",
                table: "BookHasUsers",
                columns: new[] { "BookId", "UserId", "TimeBorrowed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_BookHasUsers",
                table: "BookHasUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookHasUsers",
                table: "BookHasUsers",
                columns: new[] { "BookId", "UserId" });
        }
    }
}
