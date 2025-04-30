using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessCalendar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BookHasUsersUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TimeReturned",
                table: "BookHasUsers",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeReturned",
                table: "BookHasUsers");
        }
    }
}
