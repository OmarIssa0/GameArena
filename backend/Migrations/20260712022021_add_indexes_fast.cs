using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class add_indexes_fast : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_SenderId_Status",
                table: "FriendRequests",
                columns: new[] { "SenderId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_BlockerId_BlockedId",
                table: "Blocks",
                columns: new[] { "BlockerId", "BlockedId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_SenderId_Status",
                table: "FriendRequests");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_BlockerId_BlockedId",
                table: "Blocks");
        }
    }
}
